import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function UploadDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload />
            <span>
              Carga archivos
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Carga Archivos</DialogTitle>
            <DialogDescription>
              Carga todo tipo de archivos para que el agente pueda analizarlos y responder a tus preguntas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Label></Label>
            <Input type="file" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Subir</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
